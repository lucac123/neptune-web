export { FrameBuffer, Shader, Texture };

class FrameBuffer {
    constructor() {
        this.id = gl.createFramebuffer();
    }
    destructor() {
        gl.deleteFramebuffer(this.id);
    }
    bind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
    }
    
    unbind() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    
    bindTexture(tex_id, attachment) {
        glFramebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex_id, 0);
    }
    
    unbindTexture(attachment) {
        glFramebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
    }
}

class Shader {
    constructor(vert_code, frag_code) {
        // Compile shaders
        let vert, frag;
    
        /* VERT */
        vert = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vert, vert_code);
        gl.compileShader(vert);
        this.checkCompileErrors(vert, "VERTEX");
    
        /* FRAG */
        frag = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(frag, frag_code);
        gl.compileShader(frag);
        this.checkCompileErrors(frag, "FRAGMENT");
    
        /* COMPILATION */
        this.id = gl.createProgram();
        gl.attachShader(this.id, vert);
        gl.attachShader(this.id, frag);
        gl.linkProgram(this.id);
        this.checkCompileErrors(this.id, "PROGRAM");
    
        // Cleanup
        gl.deleteShader(vert);
        gl.deleteShader(frag);
    }
    destructor() {
        gl.deleteProgram(this.id);
    }
    
    use() {
        gl.useProgram(this.id);
    }
    
    setUniform(name, value) {
        let location = gl.getUniformLocation(this.id, name);
        if (Array.isArray(value)) {
            if (array.every(element => { Number.isInteger(value) })) {
                switch(value.length) {
                    case 2:
                        gl.uniform2iv(location, value);
                        break;
                    case 3:
                        gl.uniform3iv(location, value);
                        break;
                    case 4:
                        gl.uniform4iv(location, value);
                        break;
                }
            }
            else {
                switch(value.length) {
                    case 2:
                        gl.uniform2fv(location, value);
                        break;
                    case 3:
                        gl.uniform3fv(location, value);
                        break;
                    case 4:
                        gl.uniform4fv(location, value);
                        break;
                }
            }
        }
        else {
            if (Number.isInteger(value)) {
                gl.uniform1i(location, value);
            }
            else
                gl.uniform1f(location, value);
        }
    }
    
    checkCompileErrors(shader, type) {
        if (type != "PROGRAM") {
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log("cant even compile shader smh: ", type, "\n", gl.getShaderInfoLog(shader));
            }
        }
        else {
            if (!gl.getProgramParameter(shader, gl.LINK_STATUS)) {
                console.log("cant even link program smh", type, "\n", gl.getProgramInfoLog(shader));
            }
        }
    }
}

class Texture {
    constructor(format, width, height) {
        this.id = gl.CreateTexture();

        let internal_format;
        switch (format) {
            case gl.R16F:
                internal_format = gl.RED;
                break;
            case gl.RG16F:
                internal_format = gl.RG;
                break;
            case gl.RGB16F:
                internal_format = gl.RGB;
                break;
        }
        
        this.bind();
        gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, 0, internal_format, gl.FLOAT, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        this.unbind();
    }

    bind(texture) {
        this.texture = texture;
        gl.activeTexture(this.texture);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }
    
    unbind() {
        if (!this.texture) {
            gl.activeTexture(this.texture);
            this.texture = 0;
            gl.bindTexture(gl.TEXTURE_2D, 0);
        }
    }
}